# Frozen-data exceptions

Every time published report data was changed after publication, with the
reason. `bin/check-frozen` reads this file: a change to a frozen file or to a
report page's text fails CI until it is listed here, and the entry pins a
fingerprint of exactly that change, so it covers nothing else.

Format, one list item per change — `bin/check-frozen --propose` prints the
first half for you:

```
- `<path>` `sha256:<64 hex>` — what changed, why it had to, who agreed, date
- `<path>` `page:<64 hex>` — same, for a report page's text
```

`sha256:` is of the file as committed (for a deletion, of the file as it was).
`page:` is of a page's visible words outside its navigation, together with its
chart references and crop geometry. A reason of "WHY THIS HAD TO CHANGE" is rejected; write a real one.
See `docs/CHANGE-POLICY.md`.

## Exceptions

_None yet. The archive stands as published._
