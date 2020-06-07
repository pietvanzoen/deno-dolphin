
develop:
	denon run --allow-read --allow-net --allow-env main.ts

start:
	deno run --allow-read --allow-net --allow-env main.ts

test:
	deno test

fmt:
	deno fmt
