
  /**
   * Retrieve the bounding box coordinates for the canvas.
   *
   * @return {Array.<number>} 4-dimensional array containing, in-order, the x- and y-position of the
   *   top-left point and the x- and y-position of the bottom-right point. In other words, the
   *   returned array is of the form [x1, y1, x2, y2]
   */
  function getBoundingBox() {
    // x1, y1, x2, y2
    return [-5, -5, 5, 5];
  }

  let props = {};

  /**
   * Add a data point to the canvas. The data point will take the class index currently set via the
   * component properties.
   *
   * @param {number} x - X-coordinate of the data point to add
   * @param {number} y - Y-coordinate of the data point to add
   */
  function  addDatapoint(x, y) {
    // Class index of new data point
    const classIndex = props.classIndex;

    // Add new data point
    const datapoint = dataset.addDatapoint([x, y]);
    datapoint.setClassIndex(classIndex);

    // Add newly added data point to canvas
    canvas.addDatapoint(datapoint);

    // Classifier
    if (props.autorunEnabled) {
      classify(canvas, dataset);
    }

    // If the instructional overlay was being shown, hide it
    if (state.showOverlay) {
      setState(prevState => ({
        ...prevState,
        showOverlay: false,
      }));
    }
  }

  /**
   * Run the canvas's classifier on the associated dataset.
   */
  function classify() {
    // Only run the classifier if there are at least 2 datapoints
    if (dataset.numDatapoints <= 1) {
      return;
    }

    // Extract features
    const X = dataset.getFeaturesArray();

    // Extract and encode labels
    const labels = dataset.getLabelsArray();
    const encoder = new jsmlt.Preprocessing.LabelEncoder();
    const y = encoder.encode(labels);

    // Find the classifier implementation (i.e., the classification algorithm)
    const classifier = Classifiers[props.classifierType]
      .getClassifier(props.classifierControls);

    // Train the classifier
    classifier.train(X, y);

    if (props.classifierType === 'SVM') {
      dataset.datapoints.forEach(x => x.setMarked(false));
      classifier.getSupportVectors().forEach(x => dataset.datapoints[x].setMarked(true));
    }

    // Generate predictions for grid
    const boundaries = new jsmlt.Classification.Boundaries();
    const classIndexBoundaries = boundaries.calculateClassifierDecisionBoundaries(
      classifier,
      51,
      getBoundingBox()
    );

    // Convert boundary keys (class indices) to labels
    const labelBoundaries = Object.keys(classIndexBoundaries).reduce((a, x) => ({
      ...a,
      [encoder.decode(x)]: classIndexBoundaries[x],
    }), {});

    // Store class boundaries in canvas
    canvas.setClassBoundaries(labelBoundaries);
  }

  function shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.autorunEnabled
        || nextProps.runStatus !== props.runStatus
        || nextState.showOverlay !== state.showOverlay
    ) {
      return true;
    }

    return false;
  }

  function componentDidMount() {
    // Create canvas
    const boundingBox = getBoundingBox();
    canvas = new jsmlt.UI.Canvas(refs.canvas, {
      continuousClick: true,
      x1: boundingBox[0],
      y1: boundingBox[1],
      x2: boundingBox[2],
      y2: boundingBox[3],
    });

    // Initialize dataset
    dataset = new jsmlt.Data.Dataset();

    // Handle canvas clicks
    canvas.addListener('click', (x, y) => addDatapoint(x, y));
  }

  function render() {
    if (canvas) {
      classify();
    }

    return (
      <div>
        <div
          className={`overlay ${!state.showOverlay && 'hide'}`}
        >
          <div>
            Click to add a data point. Change the class of new data points in the sidebar.
          </div>
        </div>
        <canvas ref="canvas"></canvas>
      </div>
    );
  }