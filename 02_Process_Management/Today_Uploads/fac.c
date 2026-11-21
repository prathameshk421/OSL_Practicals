#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]){
    
    if(argc < 2){
    printf("status: %s" ,argv[0]);
    return 1;
}

    int n = atoi(argv[1]);
    if(n<0){
    printf("factorial n cant be negative!");
    return 1;
}

    unsigned long long fac = 1;
    for(int i=1;i<=n;i++)fac*=i;
    printf("factorial for %d: %lld \n", n, fac);
    return 0;

}
