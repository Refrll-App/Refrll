const SkeletonJobCard = () => (
  <div className="rounded-2xl bg-white border border-gray-100 p-6 animate-pulse">
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);



export default SkeletonJobCard;