import cv from "opencv4nodejs";

export const buffs = [
  "acum",
  "bers",
  "clar",
  "crit",
  "makt",
  "patk",
  "wind",
  "hast",
];
export const songs = [];
export const imagePath = "./buff-template-images/";
export const imageExtension = ".jpg";
export const templates = [...buffs];
/**
 *
 * @param {Buffer} sourceImageBuffer
 * @param {imageName[]} templates
 * @param {x, y, width, height} searchRegion
 * @returns
 */
export async function findMissengBuff(
  sourceImageBuffer,
  templates,
  searchRegion
) {
  // Конвертация Buffer в Matrix для OpenCV
  let sourceImage;
  try {
    sourceImage = await cv.imdecodeAsync(sourceImageBuffer);
  } catch (e) {
    console.log(e);
  }
  console.log(sourceImage);

  // Ограничиваем область поиска на основном изображении
  const roi = new cv.Rect(
    searchRegion.x,
    searchRegion.y,
    searchRegion.width,
    searchRegion.height
  );
  const sourceImageRoi = sourceImage.getRegion(roi);

  // Массив для маленьких изображений
  let templateImagesPromises = templates.map((filePath) => {
    return cv.imreadAsync(imagePath + filePath + imageExtension);
  });
  const templateImages = await Promise.all(templateImagesPromises).then(
    (r) => r
  );
  console.log({ templateImages });
  // Массив для хранения изображений, которые не удалось найти
  let notFoundImages = [];
  await Promise.all(
    templateImages.map(async (templateImage, index) => {
      return (async () => {
        // Процесс сравнения изображений
        const matchedImage = await sourceImageRoi.matchTemplateAsync(
          templateImage,
          // cv.TM_CCOEFF_NORMED
          // cv.TM_CCOEFF
          // cv.TM_CCORR
          // cv.TM_CCORR_NORMED
          // cv.TM_SQDIFF
          cv.TM_SQDIFF_NORMED
        );

        const minMax = await matchedImage.minMaxLocAsync();
        console.log({ templateImage, index, buff: templates[index] });
        console.log(minMax.maxVal);
        if (minMax.maxVal < 0.2) {
          // Предполагаемый порог для определения, была ли найдена картинка относительно уверенно.
          notFoundImages.push([templates[index], minMax.maxVal]); // Если картинка не удалось найти, добавляем её в массив "не найдено".
        } else {
          // Отрисовка рамки вокруг найденного совпадения на исходном изображении
          const color = new cv.Vec(255, 0, 0);
          const point1 = new cv.Point2(
            minMax.maxLoc.x + roi.x,
            minMax.maxLoc.y + roi.y
          );
          const point2 = new cv.Point2(
            minMax.maxLoc.x + roi.x + templateImage.cols,
            minMax.maxLoc.y + roi.y + templateImage.rows
          );
          sourceImage.drawRectangle(point1, point2, color, 2, cv.LINE_8);

          // Сохраняем изображение с отмеченным найденным совпадением
          try {
            await cv.imwriteAsync(
              `./mached/matchedImage${index + buffs[index]}.png`,
              sourceImage
            );
          } catch (e) {
            console.log(e);
          }
        }
      })();
    })
  );

  return notFoundImages;
}
