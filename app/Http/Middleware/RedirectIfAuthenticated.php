<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the 'auth_token' cookie exists
        if ($request->cookie('auth_token')) {
            // Redirect to 'my-account' page if the cookie exists
            return redirect()->route('account.index');
        }

        // Allow access to the requested page
        return $next($request);
    }
}
