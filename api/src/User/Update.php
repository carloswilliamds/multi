<?php

declare(strict_types=1);

namespace Multi\User;

use GraphQL\Error\UserError;
use Multi\Context;
use Multi\Resolver;
use Multi\User\Permission\DeleteUser;
use Multi\User\Permission\Permits;
use function Siler\array_get;

class Update implements Resolver
{
    public function __invoke($root, array $args, Context $context)
    {

        if ($context->user === null) {
            throw new UserError($context->messages->get('unauthenticated'));
        }

        if (!(new Permits($context->user))(new DeleteUser())) {
            throw new UserError($context->messages->get('unauthorized'));
        }

        $input = array_get($args, 'userInput');




        $user = new User();
        $user->id = array_get($input, 'id');
        $user->email = strtolower(trim(array_get($input, 'email')));
        $user->password = password_hash(trim(array_get($input, 'password')), PASSWORD_DEFAULT);

        $context->db->updateUser($user);
        return true;
    }
}
