<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use NilPortugues\Tests\Laravel5\JsonApi\LaravelTestCase;

class JsonApiTest extends TestCase
{
	use DatabaseMigrations;
	use DatabaseTransactions;
    /**
     * A function for set up of url for JSON API.
     *
     * 
     */
    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        $_SERVER['SERVER_NAME'] = parse_url($this->baseUrl, PHP_URL_HOST);
        $_SERVER['REQUEST_URI'] = str_replace([parse_url($uri, PHP_URL_HOST), parse_url($uri, PHP_URL_SCHEME).'://'], '', $uri);
        $_SERVER['REQUEST_METHOD'] = strtoupper($method);
        $_SERVER['QUERY_STRING'] = parse_url($uri, PHP_URL_QUERY);
        $_SERVER['PATH_INFO'] = str_replace('?'.$_SERVER['QUERY_STRING'], '', $_SERVER['REQUEST_URI']);
        $_SERVER['CONTENT_TYPE'] = 'application/json';
        $_SERVER['argv'] = explode('&', $_SERVER['QUERY_STRING']);
        parse_str($_SERVER['QUERY_STRING'], $_GET);
        return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
    }
    /**
     * A unit test to check if attributes in JSON API for lifelines are correct.
     *
     * 
     */
    public function testCheckLifelinesAttributes()
    {
      $this->seed();
      $this->json('GET', '/api/lifelines')
             ->seeJsonStructure([
                 'data' => [
                 	'*' => [
                    	'attributes' => [
                    	'name', 'layer', 'id'
                    	]
                 	]
                 ]
             ]);
    }
    /**
     * A unit test to check if attributes in JSON API for messages are correct.
     *
     * 
     */
    public function testCheckMessagesAttributes()
    {
      $this->seed();
      $this->json('GET', '/api/messages')
             ->seeJsonStructure([
                 'data' => [
                 	'*' => [
                    	'attributes' => [
                    	'name', 'interaction_id', 'id'
                    	]
                 	]
                 ]
             ]);
    }
}
