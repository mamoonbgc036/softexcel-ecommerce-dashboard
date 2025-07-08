<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAuthCookie
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
        $authToken = $request->cookie('auth_token');  // or
        $authToken = $request->cookies->get('auth_token');

        return response()->json($authToken); // Check if the cookie is being retrieved correctly
        
        //dd($authToken); // Check if the cookie is being retrieved correctly
    
        if (!$authToken) {
            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }
    
        return $next($request);
    }
    
}
