export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        © {new Date().getFullYear()} ReferHub. All rights reserved.
      </div>
    </footer>
  );
}