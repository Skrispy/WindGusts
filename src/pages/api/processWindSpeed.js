export default function handler(req, res) {
  try {
    const { speed, degree } = req.query;
    let col;
    let row;
    if (speed <= 5) {
      col = 2;
    } else if (speed > 5 && speed <= 10) {
      col = 5;
    } else if (speed > 10 && speed <= 15) {
      col = 8;
    } else {
      col = 11;
    }
    if (degree === 0) {
      row = 0;
    } else {
      row = Math.floor((degree - 1) / 30);
    }
    const gustFactor = {
      row: row,
      col: col,
    };
    return res
      .status(200)
      .send(JSON.stringify({ error: false, data: gustFactor }));
  } catch (error) {
    return res.status(405).send({ error: true });
  }
}
