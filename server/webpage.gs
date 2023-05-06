function doGet() {
  const htmlTemplate = HtmlService.createTemplateFromFile("src/main")
  return htmlTemplate.evaluate()
}
