var jsmlt = require('@jsmlt/jsmlt');

// Training data
train_X = [[-1,-1], [-1,1], [1,1], [1,-1]];
train_y = [0, 0, 1, 1];

// Testing data
test_X = [[1,2], [1,-2], [-1,-2], [-1,2]];

// Create and train classifier
var clf = new jsmlt.Supervised.SVM.SVM({
  kernel: new jsmlt.Kernel.Linear(),
});
clf.train(train_X, train_y);

// Make predictions on test data
console.log(clf.predict(test_X));