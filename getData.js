import * as tf from "@tensorflow/tfjs-node-gpu";
import fs from "node:fs";

import { default as glob } from "glob";

let trainData = [];
let testData = [];

export const getData = (trainOrTestUrl) => {
  const data = [];
  const labels = [];

  const files = glob.sync(`emotion/${trainOrTestUrl}/**/*.png`);

  files.forEach((file) => {
    const buffer = fs.readFileSync(file);

    const imageTensor = tf.node
      .decodeImage(buffer)
      .resizeBilinear([48, 48])
      .expandDims(0)
      .toFloat()
      .div(255);

    data.push(imageTensor);

    const label = file.split("/")[2];
    const labelMap = {
      angry: 0,
      disgust: 1,
      fear: 2,
      happy: 3,
      sad: 4,
      surprise: 5,
      neutral: 6,
    };
    labels.push(labelMap[label]);
  });

  return [data, labels];
};

export const loadData = () => {
  console.log("Loading data...");
  trainData = getData("train");
  testData = getData("test");
  console.log("Data loaded successfully!");
};

export const getTrainData = () => {
  return {
    data: tf.concat(trainData[0]),
    labels: tf.oneHot(trainData[1], 7),
  };
};

export const getTestData = () => {
  return {
    data: tf.concat(testData[0]),
    labels: tf.oneHot(testData[1], 7),
  };
};
