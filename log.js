
  /**
   * Retrieve the bounding box coordinates for the canvas.
   *
   * @return {Array.<number>} 4-dimensional array containing, in-order, the x- and y-position of the
   *   top-left point and the x- and y-position of the bottom-right point. In other words, the
   *   returned array is of the form [x1, y1, x2, y2]
   */
  getBoundingBox() {
    // x1, y1, x2, y2
    return [-5, -5, 5, 5];
  }

  /**
   * Add a data point to the canvas. The data point will take the class index currently set via the
   * component properties.
   *
   * @param {number} x - X-coordinate of the data point to add
   * @param {number} y - Y-coordinate of the data point to add
   */
  addDatapoint(x, y) {
    // Class index of new data point
    const classIndex = this.props.classIndex;

    // Add new data point
    const datapoint = this.dataset.addDatapoint([x, y]);
    datapoint.setClassIndex(classIndex);

    // Add newly added data point to canvas
    this.canvas.addDatapoint(datapoint);

    // Classifier
    if (this.props.autorunEnabled) {
      this.classify(this.canvas, this.dataset);
    }

    // If the instructional overlay was being shown, hide it
    if (this.state.showOverlay) {
      this.setState(prevState => ({
        ...prevState,
        showOverlay: false,
      }));
    }
  }

  /**
   * Run the canvas's classifier on the associated dataset.
   */
  classify() {
    // Only run the classifier if there are at least 2 datapoints
    if (this.dataset.numDatapoints <= 1) {
      return;
    }

    // Extract features
    const X = this.dataset.getFeaturesArray();

    // Extract and encode labels
    const labels = this.dataset.getLabelsArray();
    const encoder = new jsmlt.Preprocessing.LabelEncoder();
    const y = encoder.encode(labels);

    // Find the classifier implementation (i.e., the classification algorithm)
    const classifier = Classifiers[this.props.classifierType]
      .getClassifier(this.props.classifierControls);

    // Train the classifier
    classifier.train(X, y);

    if (this.props.classifierType === 'SVM') {
      this.dataset.datapoints.forEach(x => x.setMarked(false));
      classifier.getSupportVectors().forEach(x => this.dataset.datapoints[x].setMarked(true));
    }

    // Generate predictions for grid
    const boundaries = new jsmlt.Classification.Boundaries();
    const classIndexBoundaries = boundaries.calculateClassifierDecisionBoundaries(
      classifier,
      51,
      this.getBoundingBox()
    );

    // Convert boundary keys (class indices) to labels
    const labelBoundaries = Object.keys(classIndexBoundaries).reduce((a, x) => ({
      ...a,
      [encoder.decode(x)]: classIndexBoundaries[x],
    }), {});

    // Store class boundaries in canvas
    this.canvas.setClassBoundaries(labelBoundaries);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.autorunEnabled
        || nextProps.runStatus !== this.props.runStatus
        || nextState.showOverlay !== this.state.showOverlay
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    // Create canvas
    const boundingBox = this.getBoundingBox();
    this.canvas = new jsmlt.UI.Canvas(this.refs.canvas, {
      continuousClick: true,
      x1: boundingBox[0],
      y1: boundingBox[1],
      x2: boundingBox[2],
      y2: boundingBox[3],
    });

    // Initialize dataset
    this.dataset = new jsmlt.Data.Dataset();

    // Handle canvas clicks
    this.canvas.addListener('click', (x, y) => this.addDatapoint(x, y));
  }

  render() {
    if (this.canvas) {
      this.classify();
    }

    return (
      <div>
        <div
          className={`overlay ${!this.state.showOverlay && 'hide'}`}
        >
          <div>
            Click to add a data point. Change the class of new data points in the sidebar.
          </div>
        </div>
        <canvas ref="canvas"></canvas>
      </div>
    );
  }