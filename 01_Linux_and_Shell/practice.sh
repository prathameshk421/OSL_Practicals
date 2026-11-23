

create(){
    if [ ! -f "stud.db" ]; then 
        touch stud.db;
        echo "Roll No.|Name|Marks1|Marks2|Marks3" > stud.db;
    else 
        echo "Using Existing Database";
    fi
}

view(){
    echo "";
    if [ -f "stud.db" ]; then 
        column -t -s '|' "stud.db";
        echo ""
    else 
        echo "Database Not found!!"
    fi
}

insert(){
    echo "Enter Roll No.:"
    read roll_no

    echo "Enter Name:"
    read name

    echo "Enter Marks 1:"
    read marks1

    echo "Enter Marks 2:"
    read marks2

    echo "Enter Marks 3:"
    read marks3

    if [ -z "$roll_no" ]; then 
        echo "Roll No. canot be empty!!"
    elif [ -z "$name" ]; then 
        echo "Name cannot be empty!!"
    elif [ -z "$marks1" ]; then
        echo "Marks 1 cannot be empty!!"
    elif [ -z "$marks2" ]; then
        echo "Marks 2 cannot be empty!!"
    elif [ -z "$marks3" ]; then
        echo "Marks 3 cannot be empty!!"
    else 
        echo "$roll_no|$name|$marks1|$marks2|$marks3" >> stud.db
        echo "Record Inserted!"
    fi
}

delete(){
    echo "Enter Roll No to delete:"
    read roll_no

    if [ -z "$roll_no" ]; then 
        echo "Input cannot be empty!"
        return 
    fi 

    if grep -q "^$roll_no|" stud.db; then 
        touch temp.db
        grep -v "^$roll_no|" stud.db > temp.db
        mv temp.db stud.db
        echo "$roll_no deleted succesfully!"
    else 
        echo "Roll No. not found!!"
    fi
}

modify(){
    echo "Enter Roll No to be modified"
    read roll_no 

    echo "Enter New Roll No.:"
    read new_roll_no

    echo "Enter New Name:"
    read name

    echo "Enter New Marks 1:"
    read marks1

    echo "Enter New Marks 2:"
    read marks2

    echo "Enter New Marks 3:"
    read marks3

    if grep -q "^$roll_no|" stud.db; then 
        sed -i "s/^$roll_no|.*/$new_roll_no|$name|$marks1|$marks2|$marks3/" stud.db
        echo "Modified"
    else 
        echo "Roll No not found!!"
    fi
}

grade(){

    touch grade.db
    echo "Roll No|Grade" > grade.db

    while IFS="|" read -r roll_no name m1 m2 m3 
    do
        if [ "$roll_no" = "Roll No." ]; then 
            continue
        fi

        avg=$(( (m1+m2+m3)/3 ))

        if [ $avg -ge 90 ]; then 
            grade='O';
        elif [ $avg -ge 80 ]; then
            grade='A';
        elif [ $avg -ge 70 ]; then
            grade='B';
        elif [ $avg -ge 60 ]; then
            grade='C';
        elif [ $avg -ge 50 ]; then 
            grade='D';
        else 
            grade='F';
        fi

        echo "$roll_no|$grade" >> grade.db
    
    done < stud.db

    column -t -s '|' grade.db
    rm grade.db

}


create 

while true
do
    echo -e "student menu \n"
    echo -e "pick choice : 1: insert , 2:delete , 3:modify, 4:grade calc, 5:view 6)exit\n"
    echo "enter choice: "
    read choice

    case $choice in
        1)insert;;
        2)delete;;
        3)modify;;
        4)grade;;
        5)view;;
        6)break;;
    esac
done
echo "Byee!!"