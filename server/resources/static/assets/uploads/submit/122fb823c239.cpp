#include <bits/stdc++.h>

using namespace std;

const int maxn = 1e5 + 7;

long long n, m, a[maxn];

bool Check(long long x)
{
    long long ans = 0;
    for(int i = 1; i <= n; i++)
    {
        ans += x / a[i];
    }
    return ans >= m;
}

long long bs()
{
    long long l = 0;
    long long h = 1e18;
    while(l <= h)
    {
        long long mid = (l + h) / 2;
        if(Check(mid)) h = mid - 1;
        else l = mid + 1;
    }
    return l;
}

int main()
{
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    //freopen("application.inp", "r", stdin);
    //freopen("application.out", "w", stdout);
    cin >> n >> m;
    for(int i = 1; i <= n; i++)
    {
        cin >> a[i];
    }
    cout << bs();
}


