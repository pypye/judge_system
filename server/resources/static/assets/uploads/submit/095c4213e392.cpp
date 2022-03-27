#include <bits/stdc++.h>
#define  fori(i, a, b) for (int i = a; i<=b; i++)

using namespace std;
int n,m;
int t[100005];

int main()
{
    ios_base::sync_with_stdio(0);
    freopen("application.inp", "r", stdin);
    freopen("application.out", "w", stdout);
    cin >> n >> m;
    fori(i,1,n) cin >> t[i];
    int d = 0, c = 1e9;
    while (d<=c)
    {
        int x = (d+c)/2;
        long long tong = 0;
        fori(i,1,n)
        {
            if (x >= t[i]) tong += x/t[i];
        }
        if (tong < m) d = x+1; else c = x-1;
    }
    cout << d;
    return 0;
}
