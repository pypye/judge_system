#include <bits/stdc++.h>
#define mn 100005

using namespace std;
long long a[mn],m,mx;
int n;
bool check(long long time)
{
    long cnt=0;
    for(long i=1;i<=n;i++)
        cnt+=time/a[i];
    return cnt>=m;
}
long long bs(long long l,long long h)
{
    long m;
    while(h-l>1)
    {
        m=(l+h)/2;
        if(check(m)) h=m;
        else l=m;
    }
    if(check(l)) return l;
    else return h;
}
int main()
{
    ios_base::sync_with_stdio(0);cin.tie(0);
    //freopen("application.inp","r",stdin);
    cin>>n>>m;
    for(long i=1;i<=n;i++) cin>>a[i];
    mx=a[1]*m;
    cout<<bs(0,mx);
    return 0;
}
