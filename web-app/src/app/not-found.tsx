import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-bold">Module Not Found</h1>
      <p className="mt-3 text-muted-foreground">
        The requested module page does not exist in this challenge setup.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
      >
        Back to Home
      </Link>
    </main>
  );
}
