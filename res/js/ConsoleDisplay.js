{
  const prevConsoleLog = console.log;
  const logger = document.createElement('div');
  logger.id = 'logger';
  logger.style.fontFamily = "monospace";
  logger.style.position = "absolute";
  logger.style.left = "0";
  logger.style.top = "0";
  logger.style.zIndex = "1000";
  logger.style.height = "100%";
  logger.style.maxWidth = "50%";
  logger.style.overflowWrap = "break-word";
  logger.style.overflowY = "auto";
  logger.style.color = "white";
  document.body.appendChild(logger);

  console.log = function(message) {
    let div = document.createElement('div');
    div.innerHTML = typeof message === 'object' ? JSON.stringify(message) : message;
    logger.appendChild(div);

    if (logger.childNodes.length > 100)
    {
      logger.removeChild(logger.childNodes[0]);
    }

    //Redirect back to system console
    prevConsoleLog(message);
  };
}
