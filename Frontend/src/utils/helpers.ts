export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}

export function scaleImageRatio(
  originalWidth: number,
  originalHeight: number,
  maxDimension: number = 200
) {
  // Calculate the scale factor based on the maximum dimension
  const scaleFactor = maxDimension / Math.max(originalWidth, originalHeight);

  // Calculate the new width and height using the scale factor
  const newWidth = Math.ceil(originalWidth * scaleFactor);
  const newHeight = Math.ceil(originalHeight * scaleFactor);

  // Return the scaled width and height
  return { width: newWidth, height: newHeight };
}
export function getImageDimensions(imageUrl: string, callback: any) {
  const img = new Image();
  img.onload = function () {
    const width = img.width;
    const height = img.height;
    callback(width, height);
  };
  // Set the image URL to trigger the onload event
  img.src = imageUrl;
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  };
  const formatedDate = date.toLocaleString("en-US", options);
  const splitedData = formatedDate.split(" ");
  return splitedData[4] + " " + splitedData[5];
}
