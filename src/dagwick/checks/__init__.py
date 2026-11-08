"""Built-in checks. Importing this package registers them."""

from dagwick.checks import observability, ownership, reliability, scheduling, structure

__all__ = ["observability", "ownership", "reliability", "scheduling", "structure"]
