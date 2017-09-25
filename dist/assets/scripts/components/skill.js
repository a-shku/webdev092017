class Skill {
    constructor(width, height, container, percent) {
      this.s = Snap(container);
      const radius = width / 3;
      const cx = width / 2;
      const cy = height / 2;
      this.length = 2 * radius * Math.PI;
      this.percent = percent;
  
      this.s.attr({
        width,
        height
      });
  
      this.bgCircle = this.createCircle(cx, cy, radius, {
        fill: 'none',
        stroke: '#ccc',
        strokeWidth: 15
      });
  
      this.baseCircle = this.createCircle(cx, cy, radius, {
        fill: 'none',
        stroke: '#1bb696',
        strokeWidth: 15,
        strokeDasharray: this.length,
        strokeDashoffset: this.length
      });
  
      this.baseCircle.transform(`r-90, ${cx} ${cy}`);
    }
  
    createCircle(cx, cy, radius, attr) {
      const circle = this.s.circle(cx, cy, radius);
      circle.attr(attr);
      return circle;
    }
  
    draw() {
      Snap.animate(
        this.length,
        (1 - this.percent) * this.length,
        val => {
          this.baseCircle.attr({
            strokeDashoffset: val
          });
        },
        700,
        mina.easeinout
      );
    }
  }
  
  const html = new Skill(130, 130, '#html', 0.65);
  const css = new Skill(130, 130, '#css', 0.65);

  const js = new Skill(130, 130, '#js', 0.45);

  const php = new Skill(130, 130, '#php', 0.45);
  const mySql = new Skill(130, 130, '#mySql', 0.45);
  const node = new Skill(130, 130, '#node', 0.45);
  const mongo = new Skill(130, 130, '#mongo', 0.45);

  const git = new Skill(130, 130, '#git', 0.45);
  const gulp = new Skill(130, 130, '#gulp', 0.45);
  const bower = new Skill(130, 130, '#bower', 0.45);
  
  anim.onclick = function() {
    html.draw();
    css.draw();
    js.draw();
    php.draw();
    mySql.draw();
    node.draw();
    mongo.draw();
    git.draw();
    gulp.draw();
    bower.draw();
  };