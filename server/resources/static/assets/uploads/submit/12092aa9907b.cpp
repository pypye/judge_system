#include<bits/stdc++.h>
using namespace std;
#define int unsigned long long
int maxn  , n , d = 1 , x;
int gcd(int x,int y)
{
    int c;
    while(y!=0)
    {
        int r=x%y;
        x=y;
        y=r;
    }
    return x;
}
main()
{
    cin >> n ;
    for(int i = 1 ; i <= n ; i++)
    {
        cin >> x ;
        d = gcd( d , x);
        maxn = max( maxn , x );
    }
    int ans =  maxn / d - n ;
    if( ans % 2 == 1 ) cout << "Ali";
    else cout << "Baba";
}
