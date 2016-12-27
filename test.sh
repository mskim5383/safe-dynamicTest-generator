number=0
while [ ${number} -lt 20 ]
do
    echo "$number"
    ./generator > "test$number.txt"
    number=`expr $number + 1`
done
