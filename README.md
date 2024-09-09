# dragee-cli

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run ./src/index.ts
```

### report

To generate a new dragee asserter

```bash
bun run ./src/index.ts report --from-dir <path-to-dir> --to-dir <path-to-dir>
```

Example

```bash
bun run ./src/index.ts report --from-dir ./test/approval/sample/
```

### generate-asserter

To generate a new dragee asserter

```bash
bun run ./src/index.ts generate-asserter --name <asserter name> --output-dir <output directory>
```

Example

```bash
bun run ./src/index.ts generate-asserter --name zzz --output-dir E:\Projets\Dragee.io
```

This project was created using `bun init` in bun v1.0.22. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.