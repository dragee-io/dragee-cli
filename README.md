# dragee-cli

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

### report

To generate a dragee result report, based on asserters rules

```bash
bun run index.ts report --from-dir <path-to-dir> --to-dir <path-to-dir>
```

Example

```bash
bun run index.ts report --from-dir ./test/approval/sample/
```

### generate-asserter

To generate a new dragee asserter

```bash
bun run index.ts generate-asserter --name <asserter name> --output-dir <output directory>
```

Example

```bash
bun run index.ts generate-asserter --name zzz --output-dir E:\Projets\Dragee.io
```

### generate-grapher

To generate a new dragee grapher

```bash
bun run index.ts generate-grapher --name <grapher name> --output-dir <output directory>
```

Example

```bash
bun run index.ts generate-grapher --name zzz --output-dir E:\Projets\Dragee.io
```

This project was created using `bun init` in bun v1.0.22. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.