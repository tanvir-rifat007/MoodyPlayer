import * as tf from "@tensorflow/tfjs-node-gpu";
import { loadData, getTrainData, getTestData } from "./getData.js";

// https://teachablemachine.withgoogle.com/models/rRIfI79oY/

async function train() {
  loadData();

  const { data: trainImages, labels: trainLabels } = getTrainData();
  const { data: testImages, labels: testLabels } = getTestData();

  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      inputShape: [48, 48, 1],
      filters: 16,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );
  model.add(
    tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(
    tf.layers.conv2d({
      filters: 16,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  // Flatten for connecting to deep layers
  model.add(tf.layers.flatten());

  // One hidden deep layer
  model.add(
    tf.layers.dense({
      units: 128,
      activation: "tanh",
    })
  );
  // Output
  model.add(
    tf.layers.dense({
      units: 7,
      activation: "softmax",
    })
  );

  const optimizer = tf.train.adam(0.001);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  model.summary();

  await model.fit(trainImages, trainLabels, {
    batchSize: 64,
    epochs: 30,

    validationData: [testImages, testLabels],

    validationSplit: 0.25,
  });

  const testResult = model.evaluate(testImages, testLabels);
  console.log("Test accuracy: ", testResult[1].dataSync()[0]);

  // Save the model
  await model.save("file://./model");
}

train();
