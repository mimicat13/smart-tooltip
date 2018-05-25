<?php
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>smart tooltip</title>
    <style>
        .smart-x {
            border: 1px solid white;
            padding: 5px;
            color: white;
            cursor: pointer;
        }
    </style>
    <script src="https://code.jquery.com/jquery-2.2.4.js"></script>

    <link rel="stylesheet" type="text/css" href="smartTooltip.css">
    <script src="smartTooltip.js?t=s<?php echo rand(); ?>"></script>

</head>
<body style="background:teal;">
<br><br><br><br><br><br><br><br><br><br><br>
<div style="text-align:center;">

    <div style="display:inline-block;" class="smart-x smart-a"
         title="smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip ">
        Smart Tooltip
    </div>

    <div style="display:inline-block;" class="smart-x smart-b"
         title="smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip ">
        Smart Tooltip Static @init
    </div>

    <div style="display:inline-block;" class="smart-x smart-c"
         data-tooltip-content="#ttcd">
        Smart Tooltip Static @later param
    </div>
    <div id="ttcd" style="display:none;">
        <h2>tip</h2>
        <p>smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip
            smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip
            smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip
            smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip smart a tip
            smart a tip smart a tip smart a tip</p>
    </div>

    <div style="display:inline-block;" class="smart-x smart-d"

    >
        Smart Tooltip AJAX
    </div>

</div>
<script>
  $(document).ready(function() {
    $('.smart-a').smartTooltip();

    $('.smart-b').smartTooltip({static: true});

    $('.smart-c').smartTooltip();
    $('.smart-c').smartTooltip('params', {static: true});

    $('.smart-d').smartTooltip();
    $('.smart-d').smartTooltip('params', {
      content: 'loading',
      open: function(dom) {
        //new content (external ajax data for e.g)
        setTimeout(function() {
          dom.smartTooltip('content', 'external content');
        }, 500);
      },
    });
  });
</script>
</body>
</html>
