import turtle

# Set up the screen
screen = turtle.Screen()
screen.bgcolor("white")
screen.title("Turtle Flower Drawing")

# Create turtle
flower = turtle.Turtle()
flower.speed(0)
flower.width(2)
colors = ["red", "orange", "yellow", "green", "blue", "purple"]

# Draw flower
for i in range(72):
    flower.color(colors[i % len(colors)])
    flower.circle(100, 60)
    flower.left(115)

# Hide turtle and finish
flower.hideturtle()
turtle.done()
if __name__ == "__main__":
    screen = turtle.Screen()
    screen.bgcolor("white")
    screen.title("Turtle Flower Drawing")
    
    flower = turtle.Turtle()
    flower.speed(0)
    flower.width(2)
    colors = ["red", "orange", "yellow", "green", "blue", "purple"]
    
    for i in range(72):
        flower.color(colors[i % len(colors)])
        flower.circle(100, 60)
        flower.left(115)
    
    flower.hideturtle()
    turtle.done()
