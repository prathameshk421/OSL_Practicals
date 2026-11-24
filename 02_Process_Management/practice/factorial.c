#include<unistd.h>
#include<stdio.h>
#include<stdlib.h>

int main(int argc,char* argv[]){
    if(argc!=2){
        printf("Argumnet list is wrong\n");
        return 1;
    }

    int num=atoi(argv[1]);
    if(num<0){
        printf("Number cannot be negative!!\n");
        return 1;
    }
    long long int factorial=1;
    for(int i=1;i<=num;i++){
        factorial=factorial*i;
    }
    printf("Factorial of %d is %lld\n",num,factorial);
    return 0;
}