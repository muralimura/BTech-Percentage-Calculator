from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculate-sem-percentage", methods=["POST"])
def calculate_sem_percentage():
    data = request.json
    marks = data.get("marks", [])
    if marks:
        sem_total = sum(marks)
        sem_percentage = (sem_total / (len(marks) * 100)) * 100
        return jsonify({"percentage": round(sem_percentage, 2)})
    return jsonify({"error": "Invalid marks provided"}), 400

@app.route("/calculate-final-percentage", methods=["POST"])
def calculate_final_percentage():
    data = request.json
    percentages = data.get("percentages", [])
    if percentages:
        final_percentage = sum(percentages) / len(percentages)
        return jsonify({"final_percentage": round(final_percentage, 2)})
    return jsonify({"error": "Invalid percentages provided"}), 400

if __name__ == "__main__":
    app.run(debug=True)
