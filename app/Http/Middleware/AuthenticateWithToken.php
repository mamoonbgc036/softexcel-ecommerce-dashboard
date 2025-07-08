<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Http;

class AuthenticateWithToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    // Retrieve all headers
    $headers = getallheaders();

    // Check if 'Cookie' header exists
    if (isset($headers['Cookie'])) {
        // Parse the cookies from the 'Cookie' header
        $cookieHeader = $headers['Cookie'];
        $cookies = [];
        parse_str(str_replace('; ', '&', $cookieHeader), $cookies);

        // Get the 'authToken' from the cookies
        $authToken = $cookies['authToken'] ?? null;

        // If authToken is found, continue with the request
        if ($authToken) {
            return $next($request);
        }
    }

    // Redirect to login if authToken is not found
    return redirect()->route('login');
}

}
