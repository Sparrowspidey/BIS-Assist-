"""
Automatic robots.txt compliance, checked per-domain and cached.

This replaces manually visiting <domain>/robots.txt in a browser for
each new domain — the recursive crawler will encounter domains/paths
nobody has looked at by hand, so compliance has to be enforced in
code, not by a person checking each one first.

IMPORTANT: this does NOT use Python's stdlib urllib.robotparser.
That parser resolves conflicting rules by FIRST MATCH IN FILE ORDER,
not by longest-match-wins (the actual standard per RFC 9309, and how
Google/most real crawlers behave). BIS's real robots.txt files list
"Allow: /" before their "Disallow: /login" etc. rules — under
urllib.robotparser's file-order logic, that Allow would match first
and every Disallow rule after it would be silently ignored, defeating
the entire point of this check. The parser below implements
longest-match-wins instead, with ties going to Allow (per RFC 9309).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


@dataclass
class _Rule:
    directive: str  # "allow" or "disallow"
    pattern: str    # raw path pattern from the file


class RobotsRules:
    """Parsed robots.txt rules for one domain, with correct precedence."""

    def __init__(self, content: str, user_agent: str):
        self.rules: list[_Rule] = []
        self._parse(content, user_agent)

    def _parse(self, content: str, user_agent: str) -> None:
        ua_token = user_agent.split("/")[0].strip().lower()  # e.g. "standardai-crawler"
        current_agents: list[str] = []
        collecting = False
        matched_specific = False  # a specific (non-*) UA group already matched
        groups: dict[str, list[_Rule]] = {}

        for raw_line in content.splitlines():
            line = raw_line.split("#", 1)[0].strip()
            if not line or ":" not in line:
                continue
            field, _, value = line.partition(":")
            field = field.strip().lower()
            value = value.strip()

            if field == "user-agent":
                # A new User-agent line after rules means a new group starts
                if collecting:
                    current_agents = []
                    collecting = False
                current_agents.append(value.lower())
                groups.setdefault(value.lower(), [])
            elif field in ("allow", "disallow") and current_agents:
                collecting = True
                for agent in current_agents:
                    groups[agent].append(_Rule(field, value))

        # Prefer an exact (non-wildcard) match for our user agent; else fall
        # back to "*". This mirrors standard robots.txt group-selection.
        if ua_token in groups:
            self.rules = groups[ua_token]
        elif "*" in groups:
            self.rules = groups["*"]
        else:
            self.rules = []

    def can_fetch(self, path: str) -> bool:
        """
        Longest matching pattern wins. Equal-length Allow vs Disallow:
        Allow wins (per RFC 9309 §2.2.2). No matching rule: allowed.
        Supports '*' wildcard and trailing '$' end-anchor (Google extension,
        widely supported).
        """
        best_len = -1
        best_directive = "allow"  # default when nothing matches

        for rule in self.rules:
            pattern = rule.pattern
            if pattern == "":
                # Empty Disallow means "disallow nothing" (i.e. allow all)
                if rule.directive == "disallow":
                    continue
            if self._matches(pattern, path):
                match_len = len(pattern)
                if match_len > best_len:
                    best_len = match_len
                    best_directive = rule.directive
                elif match_len == best_len and rule.directive == "allow":
                    best_directive = "allow"

        return best_directive != "disallow"

    @staticmethod
    def _matches(pattern: str, path: str) -> bool:
        anchored_end = pattern.endswith("$")
        if anchored_end:
            pattern = pattern[:-1]

        if "*" not in pattern:
            if anchored_end:
                return path == pattern
            return path.startswith(pattern)

        # Wildcard support: split on '*' and match segments in order.
        segments = pattern.split("*")
        pos = 0
        for i, seg in enumerate(segments):
            if seg == "":
                continue
            idx = path.find(seg, pos)
            if idx == -1:
                return False
            if i == 0 and idx != 0:
                return False
            pos = idx + len(seg)
        if anchored_end:
            return path.endswith(segments[-1]) if segments[-1] else True
        return True


# Cache: domain -> RobotsRules (or None if robots.txt is unreachable,
# meaning we fall back to "no restrictions specified")
_robots_cache: dict[str, RobotsRules | None] = {}


async def _fetch_robots_txt(domain: str) -> str | None:
    """Fetch raw robots.txt content for a domain. Returns None if unreachable."""
    import httpx  # imported here, not at module level, so robots_checker
                   # (and anything that imports it) can still be imported
                   # and unit-tested in environments without httpx installed

    from app.ingestion.Config import USER_AGENT

    url = f"https://{domain}/robots.txt"
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": USER_AGENT})
            if resp.status_code == 200:
                return resp.text
            logger.info("robots.txt for %s returned HTTP %d — treating as unrestricted", domain, resp.status_code)
            return None
    except httpx.HTTPError as exc:
        logger.warning(
            "Could not fetch robots.txt for %s (%s) — treating as unrestricted for this run. "
            "Re-check manually if this persists.",
            domain,
            exc,
        )
        return None


async def _get_rules(domain: str) -> RobotsRules | None:
    if domain in _robots_cache:
        return _robots_cache[domain]

    from app.ingestion.Config import USER_AGENT

    content = await _fetch_robots_txt(domain)
    rules = RobotsRules(content, USER_AGENT) if content is not None else None

    _robots_cache[domain] = rules
    return rules


async def is_allowed_by_robots(url: str) -> bool:
    """
    Check whether robots.txt permits fetching this URL.

    Fails open (returns True) when robots.txt is missing or unreachable,
    matching standard crawler convention: no robots.txt = no stated
    restrictions. A genuine "Disallow" rule always wins when present,
    using longest-match precedence (see RobotsRules above).
    """
    parsed = urlparse(url)
    rules = await _get_rules(parsed.netloc)

    if rules is None:
        return True  # no robots.txt found/reachable — unrestricted

    path = parsed.path or "/"
    if parsed.query:
        path += "?" + parsed.query
    return rules.can_fetch(path)


def reset_cache() -> None:
    """Clear the cached robots.txt rules. Mainly useful for tests."""
    _robots_cache.clear()