export default function StoryImageBand() {
  return (
    <div className="relative -my-8 flex justify-center overflow-hidden md:-my-12">
      <div className="sticky top-1/2 -z-10 h-[45vh] w-full -translate-y-1/2 border-y-4 border-ink bg-navy md:h-[55vh]">
        {/*
          Drop your stock image in public/ as story-band.jpg.
          The placeholder shows until then.
        */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-6 text-center text-xs font-bold uppercase tracking-widest text-paper/40">
            Image coming soon
          </span>
        </div>
        <img
          src="/story-band.jpg"
          alt=""
          className="relative h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </div>
  );
}