export default function Loading() {
  return (
    <div className="min-h-screen bg-spark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated pulse ring */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-spark-border" />
          <div className="absolute inset-0 rounded-full border-4 border-t-spark-primary animate-spin" />
          <div className="w-8 h-8 rounded-full spark-gradient-primary animate-pulse" />
        </div>
        <h2 className="font-baloo text-xl font-bold text-spark-ink animate-pulse">Loading SparkLearn...</h2>
      </div>
    </div>
  );
}
