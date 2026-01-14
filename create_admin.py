from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

try:
    username = "admin"
    password = "123"
    
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        print(f"User '{username}' already exists.")
    else:
        user = User(username=username, hashed_password=hash_password(password))
        db.add(user)
        db.commit()
        print(f"User created successfully: {username} / {password}")

except Exception as e:
    print(f"Error creating user: {e}")
finally:
    db.close()
