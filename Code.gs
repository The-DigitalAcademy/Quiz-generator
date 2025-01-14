function createQuizWithIndividualFeedback() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Change "Sheet1" if needed
  var form = FormApp.create("Auto-Generated Quiz with Individual Feedback");
  
  // Enable quiz mode
  form.setIsQuiz(true);

  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) { // Skip header row
    try {
      var question = data[i][0];
      var options = [data[i][1], data[i][2], data[i][3], data[i][4]];
      var correctOption = data[i][5];
      var feedbacks = [data[i][6], data[i][7], data[i][8], data[i][9]]; // Feedback columns G to J
      
      Logger.log("Processing question " + (i) + ": " + question);
      
      // Check if correctOption exists in options
      if (options.indexOf(correctOption) === -1) {
        Logger.log("Skipping question due to invalid correct option: " + correctOption);
        continue; // Skip this question if the correct option is invalid
      }

      var item = form.addMultipleChoiceItem();
      var choices = options.map(function(option, index) {
        return item.createChoice(option, option === correctOption);
      });

      item.setTitle(question)
          .setChoices(choices)
          .showOtherOption(false)
          .setPoints(1);
      
      // Add individual feedback for each option (only if feedback is provided)
      for (var j = 0; j < options.length; j++) {
        if (feedbacks[j] && feedbacks[j].trim() !== "") { // Check if feedback is not empty
          var feedback = FormApp.createFeedback().setText(feedbacks[j]).build();
          if (options[j] === correctOption) {
            item.setFeedbackForCorrect(feedback);
          } else {
            item.setFeedbackForIncorrect(feedback);
          }
        }
      }
      
      Logger.log("Successfully added question " + (i) + ": " + question);
      
    } catch (error) {
      Logger.log("Error processing question " + (i) + ": " + question);
      Logger.log("Error message: " + error.message);
    }
  }
  
  Logger.log("Quiz created with individual feedback: " + form.getEditUrl());
}