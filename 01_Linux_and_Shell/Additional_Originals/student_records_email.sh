# Initial Checking of the file

create(){
if [ ! -f "students.db" ]; then
touch students.db
echo "Student Database Created!!\n"
echo "Roll No|Name|M1|M2|M3" > students.db
else
echo "Using Existing Student Database File\n"
fi
}

insert(){
echo ""
echo "Enter Your Roll No:"
read roll_no
echo "Enter Your Name:"
read name
echo "Enter Your Marks of Sub 1:"
read marks1
echo "Enter Your Marks of Sub 2:"
read marks2
echo "Enter Your Marks of Sub 3:"
read marks3
if [ -z "$roll_no" ]; then
echo "Roll No is empty!!\n"
return
fi
if [ -z "$name" ]; then
echo "Name is empty!!\n"
return
fi
if [ -z "$marks1" ]; then
echo "Marks of Sub 1 is empty!!\n"
return
fi
if [ -z "$marks2" ]; then
echo "Marks of Sub 2 is empty!!\n"
return
fi
if [ -z "$marks3" ]; then
echo "Marks of Sub 3 is empty!!\n"
return
fi

echo "$roll_no|$name|$marks1|$marks2|$marks3" >> students.db
}

view(){
echo ""
if [ -f "students.db" ]; then
column -t -s '|' students.db
echo ""
else
echo "File Not found!!"
fi
}

delete(){
echo ""
echo "Enter Roll_No to delete:"
read roll_no
if ! grep -q "^$roll_no|" students.db;  then
echo "Roll No not found!!\n"
else
sed -i "/^$roll_no|/d" students.db
echo "Record Deleted!!\n"
fi
}

modify(){
echo ""
echo "Enter Roll No of the record to modify:"
read roll_no

if ! grep -q "^$roll_no|" students.db;  then
echo "Roll No not found!!"
else
echo "Enter new name:"
read name
echo "Enter new Marks 1:"
read m1
echo "Enter new Marks 2:"
read m2
echo "Enter new Marks 3:"
read m3
sed -i "s/^$roll_no.*/$roll_no|$name|$m1|$m2|$m3/" students.db
echo "Record modified successfully!!\n"
fi
}

calc_grade(){
echo ""
echo "Roll No|Grade" > student_avg.db

while IFS='|' read -r roll_no name m1 m2 m3
do
if [ "$roll_no" = "Roll No" ]; then
continue
fi

avg=$(( (m1 + m2 + m3) / 3))
if [ $avg -ge 91 ]; then
grade='O'
elif [ $avg -ge 81 ]; then
grade='A'
elif [ $avg -ge 71 ]; then
grade='B'
elif [ $avg -ge 61 ]; then
grade='C'
elif [ $avg -ge 51 ]; then
grade='D'
elif [ $avg -ge 41 ]; then
grade='E'
else
grade='F'
fi
echo "$roll_no|$grade" >> student_avg.db
done < students.db

echo ""
column -t -s '|' student_avg.db
rm student_avg.db
}

create

while true
do
echo "================================="
echo "      STUDENT RECORD MENU        "
echo "================================="
echo "1. View Student Records"
echo "2. Insert Student Record"
echo "3. Delete Student Record"
echo "4. Modify Student Record"
echo "5. Calculate Grade"
echo "6. Exit"
echo "================================="

echo "Enter Your Choice:"
read choice
case $choice in
1) view;;
2) insert;;
3) delete;;
4) modify;;
5) calc_grade;;
6) break;;
*) echo "Invalid choice!\n";;
esac
done

echo "\nGood Bye!!\n"
