import DynamicMap from './components/DynamicMap';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-0 gap-0">
      <main className="row-start-2 w-full h-full">
        <DynamicMap />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Powered by {"ExlineLabs"}
      </footer>
    </div>
  );
}
