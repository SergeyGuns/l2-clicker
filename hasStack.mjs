const TRASH_HOLD_DELAY = 15 * 1000;

let healsByTime = []; //{heals:number, timestamp: Date.now()}[]

const hasStack = (targetHeals, sendCommand) => {
  const currTimestamp = Date.now();
  healsByTime.push({
    heals: Math.round(targetHeals),
    timestamp: currTimestamp,
  });
  console.log(healsByTime);
  if (currTimestamp - healsByTime[0].timestamp > TRASH_HOLD_DELAY) {
    const isStack = isAllEqual(healsByTime.map((v) => v.heals));

    healsByTime = [];
    healsByTime.push({
      heals: Math.round(targetHeals),
      timestamp: currTimestamp,
    });
    console.log("isStack", isStack);
    if (isStack) {
      console.log("stack next target");
      return sendCommand("0");
    }
    return Promise.resolve();
  }
  return Promise.resolve();
};

export { hasStack };

function isAllEqual(array) {
  if (array.length === 0) return true;

  var first = array[0];
  for (var i = 1; i < array.length; i++) {
    if (array[i] !== first) {
      return false;
    }
  }

  return true;
}
