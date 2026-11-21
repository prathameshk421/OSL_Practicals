#include<iostream>
#include<vector>
using namespace std;
#include<algorithm>


void fcfs(vector<int> &req, int n, int head, int disk){
     int total = 0;
    int curr = head;
    cout << "------------FCFS-----------" << endl;
    cout << "seek sequence: " << curr;
     for(int i=0;i<n;i++){
        total += abs(req[i]-curr);
        curr = req[i];
        cout << " ->  " << req[i];
            }

    cout << endl << "total travel : " << total;
}


void sstf(vector<int> &req, int n, int head, int disk){

    int curr = head;
    int total = 0;
    
    vector<int> visited(n,0);
    cout << endl << "------------SSTF-----------" << endl;
    cout << "seek sequence: " << curr;

    for(int i=0;i<n;i++){
        int min = 9999;
        int index = -1;

    
        for(int j=0;j<n;j++){
        if(!visited[j] && abs(curr-req[j]) < min){
            min = abs(curr-req[j]);
            index = j;
                    }
            }

            total += abs(req[index] - curr);
            curr = req[index];
            visited[index] = true;
            cout << " ->  " << req[index];

    }


    cout << endl << "total travel: " << total;

}

void scan(vector<int> &req, int n, int head, int disk){
    cout << endl << "------------SCAN-----------" << endl;
    req.push_back(0);
    req.push_back(disk-1);
    sort(req.begin(),req.end());
    int total = 0;
    int k = 0;
    while(req[k] < head){k++;}
    int curr = head;

     cout << endl << "seek sequence: " << curr;
    for(int i=k;i<req.size();i++){
       if(req[i] == curr)continue;
        total += abs(req[i] - curr);
        curr = req[i];
        cout << " ->  " << req[i];
            }
    for(int i=k-1;i>=0;i--){
    total += abs(req[i]-curr);
    curr = req[i];
    cout << " ->  " << req[i];
}

    cout << endl << "total travel: " << total;


}

void cscan(vector<int> &req, int n, int head, int disk){

cout << endl << "------------CSCAN-----------" << endl;
    req.push_back(0);
    req.push_back(disk-1);
    sort(req.begin(),req.end());
    int total = 0;
    int k = 0;
    while(req[k] < head){k++;}
    int curr = head;

     cout << endl << "seek sequence: " << curr;
    for(int i=k;i<req.size();i++){
       if(req[i] == curr)continue;
        total += abs(req[i] - curr);
        curr = req[i];
        cout << " ->  " << req[i];
            }

    total += (disk-1);
    curr = 0;

    for(int i=0;i<k;i++){
    total += abs(req[i]-curr);
    curr = req[i];
    cout << " ->  " << req[i];
}

    cout << endl << "total travel: " << total;




}

int main(){
int n;
cout << "enter number of req: ";
cin >> n;
vector<int> req(n);
int head;


cout << "enter the requests: ";
for(int i=0;i<n;i++){cin >> req[i];}
cout << "enter the head position: ";
cin >> head;
int disk;
cout << "enter disk size";
cin >> disk;

fcfs(req,n,head,disk);
sstf(req,n,head,disk);
scan(req,n,head,disk);
cscan(req,n,head,disk);

}