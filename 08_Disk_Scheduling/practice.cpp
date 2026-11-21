#include <bits/stdc++.h>
using namespace std;

int fcfs(vector<int> &a,int n,int head,int disk_end){
    cout<<"\nFCFS\n";
    int cur=head;
    int total=0;
    cout<<"Order of Serving Requests:";
    cout<<head<<' ';
    for(int i=0;i<n;i++){
        total+=abs(cur-a[i]);
        cur=a[i];
        cout<<a[i]<<" ";
    }
    return total;
}

int sstf(vector<int> &a,int n,int head,int disk_end){
    cout<<"\nSSTF\n";
    int cur=head;
    int total=0;
    cout<<"Order of Serving Requests:";
    vector<int> visited(n,0);
    cout<<head<<' ';
    for(int i=0;i<n;i++){
        int min=INT_MAX;
        int index=-1;
        for(int j=0;j<n;j++){
            if(!visited[j] && min>abs(a[j]-cur)){
                min=abs(a[j]-cur);
                index=j;
            }
        }
        if(index!=-1){
            visited[index]=1;
            total+=min;
            cur=a[index];
            cout<<a[index]<<' ';
        }
    }
    return total;
}

int scan(vector<int> a,int n,int head,int disk_end){

    cout<<"\nSCAN\n";
    vector<int> visited(n,0);
    sort(a.begin(),a.end());
    int cur=head;
    cout<<"Order of Serving Requests:";
    cout<<head<<' ';
    int total=0;
    for(int i=0;i<n;i++){
        if(a[i]>=cur && !visited[i]){
            visited[i]=1;
            total+=abs(cur-a[i]);
            cur=a[i];
            cout<<a[i]<<' ';
        }
    }
    if(cur!=disk_end){
        cout<<disk_end<<' ';
        total+=abs(cur-disk_end);
        cur=disk_end;
    }
    for(int i=n-1;i>=0;i--){
        if(a[i]<=cur && !visited[i]){
            visited[i]=1;
            total+=abs(cur-a[i]);
            cur=a[i];
            cout<<a[i]<<' ';
        }
    }
    return total;
    
}

int cscan(vector<int> a,int n,int head,int disk_end){

    cout<<"\nC-SCAN\n";
    vector<int> visited(n,0);
    sort(a.begin(),a.end());
    int cur=head;
    cout<<"Order of Serving Requests:";
    cout<<head<<' ';
    int total=0;
    for(int i=0;i<n;i++){
        if(a[i]>=cur && !visited[i]){
            visited[i]=1;
            total+=abs(cur-a[i]);
            cur=a[i];
            cout<<a[i]<<' ';
        }
    }
    total+=disk_end+abs(cur-disk_end);
    cur=0;
    for(int i=0;i<n;i++){
        if(!visited[i]){
            visited[i]=1;
            total+=abs(cur-a[i]);
            cur=a[i];
            cout<<a[i]<<' ';
        }
    }
    return total;
    
}


int main()
{
    int n, head, disk_end;

    cout << "Enter number of requests: ";
    cin >> n;

    vector<int> a(n);

    cout << "Enter request queue: ";
    for(int i = 0; i < n; i++) {
        cin >> a[i];
    }

    cout << "Enter initial head position: ";
    cin >> head;

    cout << "Enter maximum cylinder number: ";
    cin >> disk_end;

    cout << "\nTotal Head Movement: " << fcfs(a, n, head, disk_end);

    cout << "\nTotal Head Movement: " << sstf(a, n, head, disk_end);

    cout << "\nTotal Head Movement: " << scan(a, n, head, disk_end);

    cout << "\nTotal Head Movement: " << cscan(a, n, head, disk_end);

    return 0;
}
