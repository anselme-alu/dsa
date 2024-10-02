const fileSystem = require("fs");
const lineReader = require("readline");

class CompressedMatrix {
  constructor(numberOfRows, numberOfColumns) {
    this.data = new Map();
    this.totalRows = numberOfRows;
    this.totalColumns = numberOfColumns;
  }

  /**
   * Static function to generate a CompressedMatrix from a specified file path
   * @param {string} filePath - The location of the matrix file
   * @returns {CompressedMatrix} A new instance of CompressedMatrix
   */
  static createFromFile(filePath) {
    try {
      const content = fileSystem.readFileSync(filePath, "utf8");
      const contentLines = content.trim().split("\n");

      if (contentLines.length < 2) {
        throw new Error(
          `The file ${filePath} lacks sufficient lines to determine matrix dimensions`
        );
      }

      // Extract dimensions
      const rowRegex = contentLines[0].trim().match(/rows=(\d+)/);
      const columnRegex = contentLines[1].trim().match(/cols=(\d+)/);

      if (!rowRegex || !columnRegex) {
        throw new Error(
          `Incorrect dimension format in file ${filePath}. Expected 'rows=X' and 'cols=Y'`
        );
      }

      const numberOfRows = parseInt(rowRegex[1]);
      const numberOfColumns = parseInt(columnRegex[1]);

      if (isNaN(numberOfRows) || isNaN(numberOfColumns)) {
        throw new Error(
          `Invalid matrix dimensions: rows=${rowRegex[1]}, cols=${columnRegex[1]}. Numeric values expected.`
        );
      }

      const matrixInstance = new CompressedMatrix(numberOfRows, numberOfColumns);

      // Read elements
      for (let index = 2; index < contentLines.length; index++) {
        const lineContent = contentLines[index].trim();
        if (lineContent === "") continue; // Ignore blank lines

        const elementMatch = lineContent.match(/\((\d+),\s*(\d+),\s*(-?\d+)\)/);
        if (!elementMatch) {
          throw new Error(
            `Invalid format found at line ${index + 1} in file ${filePath}: ${lineContent}`
          );
        }

        const row = parseInt(elementMatch[1]);
        const column = parseInt(elementMatch[2]);
        const elementValue = parseInt(elementMatch[3]);

        matrixInstance.insertElement(row, column, elementValue);
      }

      return matrixInstance;
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  fetchElement(row, column) {
    const identifier = `${row},${column}`;
    return this.data.get(identifier) || 0;
  }

  insertElement(row, column, value) {
    if (row >= this.totalRows) this.totalRows = row + 1;
    if (column >= this.totalColumns) this.totalColumns = column + 1;

    const identifier = `${row},${column}`;
    this.data.set(identifier, value);
  }

  combine(otherMatrix) {
    const maxRows = Math.max(this.totalRows, otherMatrix.totalRows);
    const maxCols = Math.max(this.totalColumns, otherMatrix.totalColumns);
    const resultantMatrix = new CompressedMatrix(maxRows, maxCols);

    // verify if dimensions align
    if (this.totalRows !== otherMatrix.totalRows || this.totalColumns !== otherMatrix.totalColumns) {
      throw new Error(
        `Matrix dimensions are incompatible for addition. The first matrix is ${this.totalRows}x${this.totalColumns} and the second matrix is ${otherMatrix.totalRows}x${otherMatrix.totalColumns}`
      );
    }

    // Insert all elements from this matrix
    for (const [key, value] of this.data) {
      const [row, column] = key.split(",").map(Number);
      resultantMatrix.insertElement(row, column, value);
    }

    // Insert all elements from the other matrix
    for (const [key, value] of otherMatrix.data) {
      const [row, column] = key.split(",").map(Number);
      const currentValue = resultantMatrix.fetchElement(row, column);
      resultantMatrix.insertElement(row, column, currentValue + value);
    }

    return resultantMatrix;
  }

  subtractFrom(otherMatrix) {
    const maxRows = Math.max(this.totalRows, otherMatrix.totalRows);
    const maxCols = Math.max(this.totalColumns, otherMatrix.totalColumns);
    const resultantMatrix = new CompressedMatrix(maxRows, maxCols);

    // verify if dimensions align
    if (this.totalRows !== otherMatrix.totalRows || this.totalColumns !== otherMatrix.totalColumns) {
      throw new Error(
        `Matrix dimensions are incompatible for subtraction. The first matrix is ${this.totalRows}x${this.totalColumns} and the second matrix is ${otherMatrix.totalRows}x${otherMatrix.totalColumns}`
      );
    }

    // Insert all elements from this matrix
    for (const [key, value] of this.data) {
      const [row, column] = key.split(",").map(Number);
      resultantMatrix.insertElement(row, column, value);
    }

    // Subtract all elements from the other matrix
    for (const [key, value] of otherMatrix.data) {
      const [row, column] = key.split(",").map(Number);
      const currentValue = resultantMatrix.fetchElement(row, column);
      resultantMatrix.insertElement(row, column, currentValue - value);
    }

    return resultantMatrix;
  }

  multiplyBy(otherMatrix) {
    if (this.totalColumns !== otherMatrix.totalRows) {
      throw new Error(
        `Incompatible dimensions for multiplication. The first matrix columns (${this.totalColumns}) must equal the second matrix rows (${otherMatrix.totalRows})`
      );
    }

    const resultantMatrix = new CompressedMatrix(this.totalRows, otherMatrix.totalColumns);

    for (const [key1, value1] of this.data) {
      const [row1, column1] = key1.split(",").map(Number);

      for (const [key2, value2] of otherMatrix.data) {
        const [row2, column2] = key2.split(",").map(Number);

        if (column1 === row2) {
          const currentValue = resultantMatrix.fetchElement(row1, column2);
          resultantMatrix.insertElement(row1, column2, currentValue + value1 * value2);
        }
      }
    }

    return resultantMatrix;
  }

  stringify() {
    let output = `rows=${this.totalRows}\ncols=${this.totalColumns}\n`;
    for (const [key, value] of this.data) {
      const [row, column] = key.split(",");
      output += `(${row}, ${column}, ${value})\n`;
    }
    return output.trim();
  }

  saveToDisk(filePath) {
    const content = this.stringify();
    fileSystem.writeFileSync(filePath, content);
  }
}

async function executeMatrixOperation() {
  try {
    const operationsMap = {
      1: { operationName: "addition", operationMethod: "combine" },
      2: { operationName: "subtraction", operationMethod: "subtractFrom" },
      3: { operationName: "multiplication", operationMethod: "multiplyBy" },
    };

    console.log("Compressed Matrix Operations");
    console.log("1. Addition");
    console.log("2. Subtraction");
    console.log("3. Multiplication");

    const userChoice = await promptUser("Select operation (1-3): ");
    if (!operationsMap[userChoice]) {
      throw new Error("Invalid selection");
    }

    const firstFilePath = await promptUser("Enter the path for the first matrix file: ");
    const secondFilePath = await promptUser("Enter the path for the second matrix file: ");

    console.log(`Loading the first matrix from ${firstFilePath}...`);
    const firstMatrix = CompressedMatrix.createFromFile(firstFilePath);
    console.log(
      `Successfully loaded matrix of dimensions ${firstMatrix.totalRows}x${firstMatrix.totalColumns}`
    );

    console.log(`Loading the second matrix from ${secondFilePath}...`);
    const secondMatrix = CompressedMatrix.createFromFile(secondFilePath);
    console.log(
      `Successfully loaded matrix of dimensions ${secondMatrix.totalRows}x${secondMatrix.totalColumns}`
    );

    const selectedOperation = operationsMap[userChoice];
    console.log(`Executing ${selectedOperation.operationName}...`);
    const resultMatrix = firstMatrix[selectedOperation.operationMethod](secondMatrix);

    const outputFilePath = `result_${selectedOperation.operationName}.txt`;
    resultMatrix.saveToDisk(outputFilePath);

    console.log(
      `Operation completed successfully. Result saved to ${outputFilePath}`
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function promptUser(query) {
  const reader = lineReader.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    reader.question(query, (response) => {
      reader.close();
      resolve(response);
    });
  });
}

executeMatrixOperation();
