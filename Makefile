
develop:
	denon run --allow-read --allow-net server.ts

start:
	deno run --allow-read --allow-net main.ts

test:
	deno test

fmt:
	deno fmt
