import getPixels from "get-pixels";
import ndarray from "ndarray";
// Координаты прямоугольника - левый верхний угол и правый нижний угол
let rectStart = [26, 852]; // x, y
let rectEnd = [30, 1203]; // x, y
export default (imageBuffer) =>
  new Promise((res) => {
    getPixels(imageBuffer, "image/jpeg", function (err, pixels) {
      if (err) {
        console.log("Bad image buffer");
        return;
      }
      let redPixels = 1;
      let count = 1;
      let data = ndarray(
        pixels.data,
        pixels.shape,
        pixels.stride,
        pixels.offset
      );
      for (let i = rectStart[1]; i < rectEnd[1]; i++) {
        for (let j = rectStart[0]; j < rectEnd[0]; j++) {
          // console.log({ i, j });
          let r = data.get(i, j, 0);
          let g = data.get(i, j, 1);
          let b = data.get(i, j, 2);
          // console.log("r:" + r + " g:" + g + " b:" + b);
          // Поиск пикселей с преобладающим красным цветом
          if (r > 80 && g < 50 && b < 50) {
            redPixels++;
          }
          count++;
        }
      }
      res(Math.abs(redPixels / count) * 100);
    });
  });
