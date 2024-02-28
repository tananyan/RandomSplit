$(function () {
  var r = 260,
    i = 0,
    cx = 600,
    cy = 400,
    x1,
    x2,
    y1,
    y2,
    index,
    angle,
    prev_color;

  // Snap SVG Initialization
  var snap = new Snap("#circle_split");
  snap.attr({
    fill: "#cccccc",
    width: "920",
    height: "800",
  });

  //Background Circle
  snap.circle(cx, cy, r);
  // To set the papers for pushing it into the element
  var papers = snap.selectAll();
  papers.clear();

  var initial_angle = 0,
    n = 50,
    actual_angle = 360 / n,
    rad = Math.PI / 180,
    sectors,
    img,
    j = n;

  for (i = 0; i < n; i++) {
    end_angle = eval(initial_angle + actual_angle);
    popangle = eval(initial_angle + actual_angle / 2);
    sector_path = sector(cx, cy, r, initial_angle, end_angle, rad);
    j--;

    popangle = sector_path.getPointAtLength().alpha;

    // Center point of y
    var mpx1 = (x1 + x2) / 2;
    var mpy1 = (y1 + y2) / 2;

    // Centre point of x
    var mpx2 = (cx + mpx1) / 2;
    var mpy2 = (cy + mpy1) / 2;
    // var cpc = snap.circle(mpx2, mpy2, 2);

    // Text
    img = img_path(mpx2, mpy2, i);

    sectors = snap.group(sector_path, img);
    papers.push(sectors);
    initial_angle = end_angle;
  }
  // Dynamic Sector Split Up
  function sector(cx, cy, r, startAngle, endAngle, rad) {
    x1 = parseFloat(cx + r * Math.cos(-startAngle * rad));
    x2 = parseFloat(cx + r * Math.cos(-endAngle * rad));
    y1 = parseFloat(cy + r * Math.sin(-startAngle * rad));
    y2 = parseFloat(cy + r * Math.sin(-endAngle * rad));
    var flag = endAngle - startAngle > 180 ? 1 : 0;
    sectorpath =
      "M " +
      cx +
      " " +
      cy +
      " L" +
      x1 +
      " " +
      y1 +
      " A" +
      r +
      " " +
      r +
      " " +
      0 +
      " " +
      flag +
      " " +
      0 +
      " " +
      x2 +
      " " +
      " " +
      y2 +
      "z";
    console.log(j / n);
    return snap.path(sectorpath).attr({
      //fill: '#'+Math.floor(Math.random()*16777215).toString(16),
      fill: "rgba(34,34,34," + j / n + ")",
      class: "sectors",
      stroke: "#666",
    });
  }

  function img_path(x, y, i) {
    var text = snap.text(x, y, n - i);
    text.attr({
      fill: "#ffffff",
      // textAlign: "right",
      // margin: "0 50px 0 0",
      fontSize: "14px",
    });
    text.transform(
      "t0" +
        "," +
        text.getBBox().height / 4 +
        "r-" +
        ((i + 1) * actual_angle - actual_angle + actual_angle / 2) +
        "," +
        x +
        "," +
        (y - text.getBBox().height / 4)
    );
    return text;
  }

  // Matrix Translate and rotate
  // var t = new Snap.Matrix();
  // var text = snap.text(390, 80, "Lucky Wheel");
  // text.attr({
  //   fontSize: 80,
  //   fill: "#ffffff",
  // });

  // Grouping an entire sectors and text so that can animate entire circle.
  var g = snap.group(papers);

  // Selector Handle
  var tpx1, tpx2, tpy1, tpy2, tpcx, tpcy;
  tpx1 = cx + 25;
  tpx2 = cx - 25;
  tpcy = cy - r - 10;
  tpy1 = tpcy + 25;

  var trianglePoly =
    tpx1 + "," + tpcy + " " + cx + "," + tpy1 + " " + tpx2 + "," + tpcy;

  var triangle = snap.polyline(trianglePoly);
  triangle.attr({
    id: "pointer",
    fill: "rgba(5,111,113,.9)",
  });

  $(".spin")
    .unbind("click")
    .bind("click", function (e) {
      e.preventDefault();
      angle = randomization();
      $(".text").fadeOut();
      g.animate(
        { transform: "r" + angle + "," + cx + "," + cy },
        3000,
        mina.easeinout,
        function () {
          // Stop Rotate Wheel
          arc = Math.PI / (n / 2);
          var sa = (angle * Math.PI) / 180;
          var degrees = (sa * 180) / Math.PI + 90;
          var arcd = (arc * 180) / Math.PI;
          index = Math.floor((360 - (degrees % 360)) / arcd);
          prev_color = papers[n - index - 1][0].attr("fill");
          papers[n - index - 1][0].animate(
            {
              fill: "#ffffff",
              stroke: "#ffffff",
            },
            300,
            mina.easeinout
          );
          papers[n - index - 1][1].animate(
            {
              fill: "#222222",
            },
            300,
            mina.easeinout
          );
          $(".repos").fadeIn();
        }
      );
    });
  $(".reset")
    .unbind("click")
    .bind("click", function (e) {
      e.preventDefault();
      $(".text").fadeIn();
      papers[n - index - 1][0].attr({
        fill: prev_color,
        stroke: "#666666",
      });
      papers[n - index - 1][1].attr({
        fill: "#ffffff",
      });
      g.transform("r0" + "," + cx + "," + cy);
      $(".repos").fadeOut();
    });

  // Generating Random Number
  function randomization() {
    // Generating a random integer less than 24 * 15 = 360
    var angle_dev = Math.floor(Math.random() * 24 + 1);
    // Generating a random integer between 2 and 8
    var rotate_count = Math.floor(Math.random() * (8 - 2 + 1) + 2);
    var rotate_angle_cal = rotate_count * (angle_dev * 15) + actual_angle / 2;
    //console.log(rotate_angle_cal);
    return rotate_angle_cal;
  }
});
