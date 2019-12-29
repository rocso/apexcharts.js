export default class XAnnotations {
  constructor(annoCtx) {
    this.w = annoCtx.w
    this.annoCtx = annoCtx

    this.invertAxis = this.annoCtx.invertAxis
  }

  addXaxisAnnotation(anno, parent, index) {
    let w = this.w

    let min = this.invertAxis ? w.globals.minY : w.globals.minX
    let max = this.invertAxis ? w.globals.maxY : w.globals.maxX
    const range = this.invertAxis ? w.globals.yRange[0] : w.globals.xRange

    let x1 = (anno.x - min) / (range / w.globals.gridWidth)

    if (this.annoCtx.inversedReversedAxis) {
      x1 = (max - anno.x) / (range / w.globals.gridWidth)
    }

    const text = anno.label.text

    if (
      (w.config.xaxis.type === 'category' ||
        w.config.xaxis.convertedCatToNumeric) &&
      !this.invertAxis
    ) {
      x1 = this.annoCtx.helpers.getStringX(anno.x)
    }

    let strokeDashArray = anno.strokeDashArray

    if (x1 < 0 || x1 > w.globals.gridWidth) return

    if (anno.x2 === null) {
      let line = this.annoCtx.graphics.drawLine(
        x1 + anno.offsetX, // x1
        0 + anno.offsetY, // y1
        x1 + anno.offsetX, // x2
        w.globals.gridHeight + anno.offsetY, // y2
        anno.borderColor, // lineColor
        strokeDashArray, //dashArray
        anno.borderWidth
      )
      parent.appendChild(line.node)
    } else {
      let x2 = (anno.x2 - min) / (range / w.globals.gridWidth)

      if (this.annoCtx.inversedReversedAxis) {
        x2 = (max - anno.x2) / (range / w.globals.gridWidth)
      }
      if (
        (w.config.xaxis.type === 'category' ||
          w.config.xaxis.convertedCatToNumeric) &&
        !this.invertAxis
      ) {
        x2 = this.annoCtx.helpers.getStringX(anno.x2)
      }

      if (x2 < x1) {
        let temp = x1
        x1 = x2
        x2 = temp
      }

      if (text) {
        let rect = this.annoCtx.graphics.drawRect(
          x1 + anno.offsetX, // x1
          0 + anno.offsetY, // y1
          x2 - x1, // x2
          w.globals.gridHeight + anno.offsetY, // y2
          0, // radius
          anno.fillColor, // color
          anno.opacity, // opacity,
          1, // strokeWidth
          anno.borderColor, // strokeColor
          strokeDashArray // stokeDashArray
        )
        parent.appendChild(rect.node)
      }
    }
    let textY = anno.label.position === 'top' ? -3 : w.globals.gridHeight

    let textRects = this.annoCtx.graphics.getTextRects(
      text,
      parseFloat(anno.label.style.fontSize)
    )

    let elText = this.annoCtx.graphics.drawText({
      x: x1 + anno.label.offsetX,
      y:
        textY +
        anno.label.offsetY -
        (anno.label.position === 'top'
          ? textRects.width / 2 - 12
          : -textRects.width / 2),
      text,
      textAnchor: anno.label.textAnchor,
      fontSize: anno.label.style.fontSize,
      fontFamily: anno.label.style.fontFamily,
      foreColor: anno.label.style.color,
      cssClass: `apexcharts-xaxis-annotation-label ${
        anno.label.style.cssClass
      } ${anno.id ? anno.id : ''}`
    })

    elText.attr({
      rel: index
    })

    parent.appendChild(elText.node)

    // after placing the annotations on svg, set any vertically placed annotations
    this.annoCtx.helpers.setOrientations(anno, index)
  }
  drawXAxisAnnotations() {
    let w = this.w

    let elg = this.annoCtx.graphics.group({
      class: 'apexcharts-xaxis-annotations'
    })

    w.config.annotations.xaxis.map((anno, index) => {
      this.addXaxisAnnotation(anno, elg.node, index)
    })

    return elg
  }
}
