#include<stdio.h>
#include<limits.h>

int min(int a,int b){
    return a>b ? b:a;
}
int max(int a,int b){
    return a<b ? b:a;
}
void fifo(){
    printf("FIFO TECHNIQUE!!!\n\n");
    int frames[100];
    int ref[100];
    int n,m;

    printf("Enter no of Frames: ");
    scanf("%d",&n);
    printf("Enter no of Pages: ");
    scanf("%d",&m);

    for(int i=0;i<m;i++){
        printf("Enter reference page %d:",i);
        scanf("%d",&ref[i]);
    }

    for(int i=0;i<n;i++){
        frames[i]=-1;
    }

    int front=0;
    int faults=0;
    int hits=0;

    for(int i=0;i<m;i++){
        int found=0;
        for(int j=0;j<n;j++){
            if(frames[j]==ref[i]){
                found=1;
                break;
            }
        }
        if(found==1){
            hits++;
        }
        else{
            frames[front]=ref[i];
            front=(front+1)%n;
            faults++;
        }
        printf("Page %d: ",ref[i]);
        for(int j=0;j<n;j++){
            if(frames[j]==-1){
                printf("- ");
            }
            else{
                printf("%d ",frames[j]);
            }
        }
        if(found==1){
            printf("Hit\n");
        }
        else{
            printf("Miss\n");
        }
    }
    printf("Total Page Faults: %d\n",faults);
    printf("Total Page Hits: %d\n",hits);
}
void lru(){
    printf("LRU TECHNIQUE!!!\n\n");
    int frames[100];
    int ref[100];
    int last[100];
    int n,m;

    printf("Enter no of Frames: ");
    scanf("%d",&n);
    printf("Enter no of Pages: ");
    scanf("%d",&m);

    for(int i=0;i<m;i++){
        printf("Enter reference page %d:",i);
        scanf("%d",&ref[i]);
    }

    for(int i=0;i<n;i++){
        frames[i]=-1;
        last[i]=0;
    }

    int time=0;
    int faults=0;
    int hits=0;

    for(int i=0;i<m;i++){
        time++;
        int index_found=-1;
        for(int j=0;j<n;j++){
            if(frames[j]==ref[i]){
                index_found=j;
                break;
            }
        }
        if(index_found!=-1){
            hits++;
            last[index_found]=time;
            printf("Page %d: ",ref[i]);
            for(int j=0;j<n;j++){
                if(frames[j]==-1){
                    printf("- ");
                }
                else{
                    printf("%d ",frames[j]);
                }
            }
            printf("Hit\n");
        }
        else{
            int index_ans=-1;
            for(int j=0;j<n;j++){
                if(frames[j]==-1){
                    index_ans=j;
                    break;
                }
            }
            if(index_ans==-1){
                int min_time=INT_MAX;
                for(int j=0;j<n;j++){
                    int prev=min_time;
                    min_time=min(min_time,last[j]);
                    if(prev!=min_time){
                        index_ans=j;
                    }
                }
            }
            frames[index_ans]=ref[i];
            last[index_ans]=time;
            faults++;
            printf("Page %d: ",ref[i]);
            for(int j=0;j<n;j++){
                if(frames[j]==-1){
                    printf("- ");
                }
                else{
                    printf("%d ",frames[j]);
                }
            }
            printf("Miss\n");
        }
    }
    printf("Total Page Faults: %d\n",faults);
    printf("Total Page Hits: %d\n",hits);
}
int main(){
    int choice;
    printf("PAGE REPLACEMENT TECHNIQUES!!!\n\n");
    printf("Enter choice:\n");
    printf("1. FIFO\n");
    printf("2. LRU\n");
    printf("3. Exit\n");
    for(int i=0;i<100;i++){
        printf("Enter choice:");
        scanf("%d",&choice);
        if(choice==1){
            fifo();
        }
        if(choice==2){
            lru();
        }
        if(choice==3){
            break;
        }
    }
}
