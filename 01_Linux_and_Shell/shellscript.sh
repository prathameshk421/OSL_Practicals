#!/bin/bash

create(){
    if [ ! -f "stud.db" ]; then
        touch stud.db
        echo "RollNum|Name|m1|m2|m3" > stud.db
    else
        echo "using existing database"
    fi
}


view(){
    echo ""
    if [ -f "stud.db" ]; then
        column -t -s '|' "stud.db"
        echo ""
    else
        echo "database not found!"
    fi       
}

insert(){
        echo "enter roll num:"
        read roll_num
        echo "enter name: "
        read name
        echo "enter marks of m1: "
        read m1
        echo "enter marks of m2: "
        read m2
        echo "enter marks of m3: "
        read m3

        if [ -z "$roll_num" ];then
            echo "roll num empty"
            return
        fi
        if [ -z "$name" ];then
            echo "name empty"
            return
        fi
        if [ -z "$m1" ];then
            echo "m1 empty"
            return
        fi
        if [ -z "$m2" ];then
            echo "m2  empty"
            return
        fi
        if [ -z "$m3" ];then
            echo "m3 empty"
            return
        fi

        echo "$roll_num|$name|$m1|$m2|$m3" >> stud.db
        echo "record inserted"

}


delete(){
    echo "enter roll num u want to delete: "
    read roll_num
    if grep -q "^$roll_num|" stud.db; then
        #sed -i "/^$roll_num|/d" stud.db
        touch temp.db
        grep -v "^$roll_num|" stud.db > temp.db
        mv temp.db stud.db
        echo "$roll_num deleted!"
    else
        echo "roll number not found"
    fi
}

modify(){
    echo "enter roll num u want modified: "
    read roll_num
    echo "enter new roll num: "
    read new_roll
    echo "enter name"
    read name
    echo "enter marks of m1: "
    read m1
    echo "enter marks of m2: "
    read m2
    echo "enter marks of m3: "
    read m3
    
    if grep -q "^$roll_num|" stud.db; then
        sed -i "s/^$roll_num|.*/$new_roll|$name|$m1|$m2|$m3/" stud.db
        echo "modified"
    else
        echo "roll num not found :("
    fi
}


grade(){
    touch grade.db
    echo "RollNum|grade" > grade.db
    while IFS='|' read -r roll name m1 m2 m3
    do
        if [ "$roll" = "RollNum" ]; then
            continue
        fi
    
        avg=$(( (m1 + m2 + m3) / 3 ))

        if [ $avg -ge 90 ]; then
            grade='O'
        
        elif [ $avg -ge 80 ];then
            grade='A'
        
        elif [ $avg -ge 70 ]; then
            grade='B'
        
        elif [ $avg -ge 50 ]; then
            grade='C'
        
        elif [ $avg -ge 36 ]; then
            grade='D'
        
        else
            grade='FAIL'
        fi
    
        echo "$roll|$grade" >> grade.db
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
echo "goodbyeeeee"


    
