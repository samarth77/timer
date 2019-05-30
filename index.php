<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <link rel="stylesheet" href="timer.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
</head>
<body>

<div class="user-timer" id="user-timer" data-sound1="the-calling.mp3" data-sound2="the-calling.ogg">
    <span> 
        <input class="timer-check-integer" id="hours"  type="text" value="00" disabled maxlength="2">
        <label > Hr </label>
    </span>


    <span> 
        <input  class="timer-check-integer" id="minutes" type="text"   value="00" disabled maxlength="2">
        <label > Min </label>
    </span>

    <span> 
        <input  class="timer-check-integer"  id="seconds" type="text"  value="00" disabled maxlength="2">
        <label > Sec </label>
    </span>  

    <button id="start" type="button" style="display: none" ><i class="fa fa-play"></i>Play</button>
    <button id="reset" type="button" style="display: none" ><i class="fa fa-undo"></i>Reset</button>
    <button id="save-timer" type="button" style="display: none"><i class="fa fa-save"></i>Save</button>
    <button id="edit-timer" type="button">Set Time</button>
      <div id="sound"></div>
    <br>
    <label><input type="radio" name="func" id="countdown" style="display: none" value="countdown" checked> </label>
    <input id="lock" type="checkbox" checked style="display: none">
</div>

<script type="text/javascript" src="timer.js"></script>
</body>
</html>
